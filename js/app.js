import { db } from "/src/firebase-config.js";
import { doc, updateDoc, increment, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// Object to store the user's selections
const surveyData = {};
const selectedQuestions = new Set(); // To store selected questions for limited ones

// Questions that have a selection limit
const limitedQuestions = [
    "type-stats",
    "frequency",
    "time_stats",
    "method",
    "wash",
    "Amount",
    "Length",
    "Expertise"
];

// Function to handle option selection with limits
const handleOptionSelect = (question, option, button) => {
    if (limitedQuestions.includes(question) && selectedQuestions.has(question)) {
        showFloatingWarning();
        return;
    }

    // Store the selection
    surveyData[question] = option;
    selectedQuestions.add(question);

    // Disable other buttons for this question
    document.querySelectorAll(`button[data-question="${question}"]`).forEach(btn => {
        if (btn !== button) {
            btn.classList.add("disabled");
        }
    });

    console.log(surveyData); // For debugging, to see what's being selected
};

// Function to update Firestore based on `surveyData`
const submitSurvey = async () => {
    try {
        for (const [question, option] of Object.entries(surveyData)) {
            const docRef = doc(db, "teas", question);
            await updateDoc(docRef, {
                [option]: increment(1)
            });
            console.log(`Updated ${question}: ${option}`);
        }

        // Increment surveyors count
        const surveyorsRef = doc(db, "teas", "surveyors_count");
        await updateDoc(surveyorsRef, {
            count: increment(1)
        });

        alert("Survey submitted successfully!");

        // Reset the selections after submitting
        selectedQuestions.clear();
        document.querySelectorAll(".disabled").forEach(btn => btn.classList.remove("disabled"));
    } catch (error) {
        console.error("Error updating document: ", error);
    }
};

// Function to show a floating warning
const showFloatingWarning = () => {
    const warning = document.getElementById("floating-warning");
    warning.style.display = "block";

    setTimeout(() => {
        warning.style.display = "none";
    }, 3000);
};

// Function to initialize surveyor count if it doesn't exist
const initializeSurveyorCount = async () => {
    const surveyorsRef = doc(db, "teas", "surveyors_count");
    const docSnap = await getDoc(surveyorsRef);

    if (!docSnap.exists()) {
        await setDoc(surveyorsRef, { count: 0 });
        console.log("Surveyor count initialized to 0");
    }
};

// Event listeners for all option buttons
document.querySelectorAll("button[data-question]").forEach(button => {
    button.addEventListener("click", () => {
        const question = button.getAttribute("data-question");
        const option = button.getAttribute("data-option");
        handleOptionSelect(question, option, button);
    });
});

// Event listener for the "Submit" button
document.getElementById("submit-btn").addEventListener("click", submitSurvey);

// Initialize surveyor count on load
initializeSurveyorCount();
