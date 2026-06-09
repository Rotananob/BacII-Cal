// Function កំណត់និទ្ទេសតាមមុខវិជ្ជា (ផ្អែកលើពិន្ទុពេញរបស់មុខវិជ្ជានោះ)
function getSubjectGrade(score, maxScore, subject) {
    if (maxScore === 0) return 'N/A';
    const normalizedScore = Math.max(0, score); 
    const percentage = (normalizedScore / maxScore) * 100;

    // 🔥 លក្ខខណ្ឌពិសេសសម្រាប់ភាសាអង់គ្លេស
    if (subject === "ភាសាបរទេស") {
        const THRESHOLD_PASS_EN = 25; // 50% នៃ Max 50 គឺ 25
        
        // ច្បាប់៖ បើពិន្ទុក្រោម 25 គឺ F ទោះបីភាគរយទូទៅកំណត់យ៉ាងណា
        if (normalizedScore < THRESHOLD_PASS_EN) return 'F'; 
        // បើ >= 25 គឺអនុវត្តតាមភាគរយថ្មីរបស់អ្នក
    }
    
    // 🔥 លក្ខខណ្ឌនិទ្ទេសថ្មីដែលកំណត់ដោយអ្នក (សម្រាប់មុខវិជ្ជាទាំងអស់)
    if (percentage >= 90) return 'A'; // 90% ឡើងទៅ
    if (percentage >= 80) return 'B'; // 80% - 89%
    if (percentage >= 70) return 'C'; // 70% - 79%
    if (percentage >= 60) return 'D'; // 60% - 69%
    if (percentage >=50) return 'E'; // 50% - 59%
    
    // ចំណុចទី 6: បើពិន្ទុទាបជាង 50% គឺ F (សម្រាប់មុខវិជ្ជាផ្សេង)
    return 'F'; 
}

// រចនាសម្ព័ន្ធមេគុណ និងពិន្ទុពេញ (តាមការបញ្ជាក់ចុងក្រោយ)
const SUBJECT_CONFIG = {
    "គណិតវិទ្យា": { sci_max: 125, soc_max: 75, sci_coef: 1.0, soc_coef: 1.0 },
    "រូបវិទ្យា": { sci_max: 75, soc_max: 0, sci_coef: 1.0, soc_coef: 0 },
    "គីមីវិទ្យា": { sci_max: 75, soc_max: 0, sci_coef: 1.0, soc_coef: 0 },
    "ជីវៈវិទ្យា": { sci_max: 75, soc_max: 0, sci_coef: 1.0, soc_coef: 0 },
    "អក្សរសិល្ប៍ខ្មែរ": { sci_max: 75, soc_max: 125, sci_coef: 1.0, soc_coef: 1.0 },
    "ប្រវត្តិវិទ្យា": { sci_max: 50, soc_max: 75, sci_coef: 1.0, soc_coef: 1.0 },
    "ភាសាបរទេស": { sci_max: 50, soc_max: 50, sci_coef: 1.0, soc_coef: 1.0 },
    "សីលធម៌": { sci_max: 0, soc_max: 75, sci_coef: 0, soc_coef: 1.0 },
    "ផែនដីវិទ្យា": { sci_max: 0, soc_max: 50, sci_coef: 0, soc_coef: 1.0 },
    "ភូមិវិទ្យា": { sci_max: 0, soc_max: 75, sci_coef: 0, soc_coef: 1.0 }
};

// 🔥 ពិន្ទុពេញសរុបថ្មី (475)
const MAX_TOTAL_SCORE = 475; 

// កម្រិតពិន្ទុសម្រាប់និទ្ទេសសរុប (ផ្អែកលើ Max 475)
const GRADE_THRESHOLDS = [
    { grade: 'A', minScore: 427 }, // 90% នៃ 475
    { grade: 'B', minScore: 380 }, // 80% នៃ 475 
    { grade: 'C', minScore: 332 }, // 70% នៃ 475
    { grade: 'D', minScore: 285 }, // 60% នៃ 475
    { grade: 'E', minScore: 237 }  // 50% នៃ 475
];

// ពិន្ទុអប្បបរមាដើម្បីជាប់ 
const PASS_THRESHOLD = 237; // តាមការគណនាលើ 475 ពី 237/475 = 50%

const ENGLISH_BASE_SCORE = 25; // 25 ពិន្ទុដែលមិនរាប់ចូលក្នុងការគណនាសរុប

// មុខងារផ្ទុកមុខវិជ្ជាទៅក្នុងតារាង
function loadSubjects() {
    const major = document.querySelector('input[name="major"]:checked').value;
    const isScience = major === 'science';
    const tbody = document.getElementById('subjectInputBody');
    tbody.innerHTML = ''; 

    for (const [subject, config] of Object.entries(SUBJECT_CONFIG)) {
        const coefficient = isScience ? config.sci_coef : config.soc_coef;
        const maxScore = isScience ? config.sci_max : config.soc_max;
        
        if (maxScore > 0) { 
            const row = tbody.insertRow();
            
            row.insertCell(0).textContent = subject;
            row.insertCell(1).textContent = maxScore;
            row.insertCell(2).textContent = coefficient;

            const inputCell = row.insertCell(3);
            const input = document.createElement('input');
            input.type = 'number';
            input.min = '0';
            input.max = maxScore; 
            input.id = subject.replace(/\s/g, '_');
            input.className = 'score-input';
            
            input.placeholder = "បញ្ចូលពិន្ទុ"; 
            input.value = ""; 
            
            input.addEventListener('input', function() {
                let scoreValue = parseFloat(this.value) || 0; 
                const max = parseFloat(this.max);

                if (isNaN(scoreValue) || scoreValue < 0) {
                    this.value = 0;
                    scoreValue = 0;
                } else if (scoreValue > max) {
                    alert(`ពិន្ទុសម្រាប់មុខវិជ្ជា ${subject} មិនអាចលើសពី ${max} បានទេ។`);
                    this.value = max; 
                    scoreValue = max;
                }
                
                const gradeCell = document.getElementById(`grade_${subject.replace(/\s/g, '_')}`);
                const grade = getSubjectGrade(scoreValue, max, subject); // ប្រើ getSubjectGrade ថ្មី
                gradeCell.textContent = '...'; 
                gradeCell.className = 'subject-grade-display pending-grade'; 
            });
            
            inputCell.appendChild(input);

            const gradeCell = row.insertCell(4);
            gradeCell.id = `grade_${subject.replace(/\s/g, '_')}`;
            gradeCell.className = 'subject-grade-display pending-grade'; 
            gradeCell.textContent = '...'; 
        }
    }
    document.getElementById('resultDisplay').style.display = 'none';
}

// មុខងារសម្រាប់ clear ទិន្នន័យទាំងអស់
function clearData() {
    const inputs = document.querySelectorAll('.score-input-table input[type="number"]');
    inputs.forEach(input => {
        input.value = ""; 
        input.placeholder = "បញ្ចូលពិន្ទុ"; 
        
        const event = new Event('input');
        input.dispatchEvent(event);
    });
    
    document.getElementById('resultDisplay').style.display = 'none';
    document.getElementById('finalNotification').textContent = '';
    
    const grades = document.querySelectorAll('.subject-grade-display');
    grades.forEach(grade => {
        grade.textContent = '...'; 
        grade.className = 'subject-grade-display pending-grade';
    });
}

// មុខងារគណនាលទ្ធផលចុងក្រោយ
function calculateResults() {
    const userNameInput = document.getElementById('userName');
    const userName = userNameInput.value.trim();

    if (userName === "") {
        alert("សូមមេត្តាបំពេញឈ្មោះរបស់អ្នកជាមុនសិន ទើបអាចគណនាលទ្ធផលបាន។");
        userNameInput.focus(); 
        return; 
    }
    const displayUserName = userName; 

    const major = document.querySelector('input[name="major"]:checked').value;
    const isScience = major === 'science';
    let totalScore = 0;
    
    for (const [subject, config] of Object.entries(SUBJECT_CONFIG)) {
        const maxScore = isScience ? config.sci_max : config.soc_max;
        const coefficient = isScience ? config.sci_coef : config.soc_coef;

        if (maxScore > 0) {
            const subjectId = subject.replace(/\s/g, '_');
            const inputElement = document.getElementById(subjectId);
            
            let score = parseFloat(inputElement.value) || 0; 
            
            score = Math.min(score, maxScore);
            score = Math.max(0, score);
            
            inputElement.value = (score > 0) ? score : "";

            // 1. គណនានិទ្ទេសតាមមុខវិជ្ជា (ប្រើភាគរយថ្មី)
            const subjectGrade = getSubjectGrade(score, maxScore, subject);
            const gradeDisplayElement = document.getElementById(`grade_${subjectId}`);
            
            gradeDisplayElement.textContent = subjectGrade;
            gradeDisplayElement.className = `subject-grade-display ${subjectGrade}`;
            
            // 2. ការគណនាពិន្ទុសរុប (រក្សាលក្ខខណ្ឌពិសេសសម្រាប់ភាសាបរទេស)
            let scoreToCount = score;
            if (subject === "ភាសាបរទេស") {
                if (score >= ENGLISH_BASE_SCORE) {
                    scoreToCount = score - ENGLISH_BASE_SCORE; 
                } else {
                    scoreToCount = 0; // ពិន្ទុក្រោម 25 មិនរាប់ចូល
                }
            }
            
            const weightedScore = scoreToCount * coefficient;
            totalScore += weightedScore;
        }
    }

    document.getElementById('totalScoreDisplay').textContent = totalScore.toFixed();
    document.getElementById('resultDisplay').style.display = 'block';

    let passStatus = "ធ្លាក់";
    let finalGrade = "F";
    let statusClass = "F";
    let notificationTitle = "";
    let notificationClass = "failure-message"; 
    let adviceText = "";

    // លក្ខខណ្ឌច្បាស់លាស់៖ ជាប់/ធ្លាក់ ផ្អែកលើពិន្ទុសរុបតែប៉ុណ្ណោះ (>= PASS_THRESHOLD)
    if (totalScore >= PASS_THRESHOLD) {
        passStatus = "ជាប់";
        notificationClass = "success-message"; 
        
        let gradeFound = false;
        for (const threshold of GRADE_THRESHOLDS) {
            if (totalScore >= threshold.minScore) { 
                finalGrade = threshold.grade;
                statusClass = threshold.grade;
                gradeFound = true;
                break;
            }
        }
        
        if (!gradeFound) {
             finalGrade = 'E';
             statusClass = 'E';
        }
        
        notificationTitle = `🎉 អបអរសាទរផង ${displayUserName} ☺️`;
        adviceText = `ពិន្ទុរបស់អ្នកគឺ ${totalScore.toFixed()}។ ការតស៊ូរបស់អ្នកបានទទួលផលហើយ! សូមបន្តការសិក្សានៅសាកលវិទ្យាល័យ និង ចាប់យកជំនាញមួយដោយជោគជ័យ។`;
        
    } else {
        passStatus = "ធ្លាក់";
        notificationTitle = `🔴 សូមចូលរួមសោកស្ដាយផង ${displayUserName} 😓`;
        
        adviceText = `ពិន្ទុសរុបរបស់អ្នកគឺ ${totalScore.toFixed()}។ កុំបាក់ទឹកចិត្ត! ភាពបរាជ័យនេះជាបទពិសោធន៍។ សូមពិនិត្យមើលពិន្ទុមុខវិជ្ជាដែលអ្នកខ្សោយទាំងប៉ុន្មាននោះ ហើយត្រៀមខ្លួនសម្រាប់សម័យប្រឡងក្រោយៗព្រោះអ្នកមានពេល១ឆ្នាំពេញដើម្បីរៀនម្ដងទៀត ឬក៏អ្នកអាចបន្តរៀនឆ្នាំទី១ ហើយដាក់ពាក្យស្វ័យរិនបាន ។ លិទ្ធផលបាក់ឌុបមិនបានកំណត់ជោគវាសនាយើងនោះឡើយ ។ `;
    }

    document.getElementById('passStatus').textContent = passStatus;
    document.getElementById('passStatus').className = statusClass; 
    document.getElementById('finalGrade').textContent = finalGrade;
    document.getElementById('finalGrade').className = statusClass;
    
    document.getElementById('finalNotification').innerHTML = `
        ${notificationTitle}
        <p style="font-size: 0.5em; font-weight: 500; margin-top: 10px;">${adviceText}</p>
    `;
    document.getElementById('finalNotification').className = `notification-message ${notificationClass}`;
}

// =====================================================
// Profile Settings Functions
// =====================================================

// Open Profile Modal
function openProfileModal() {
    document.getElementById('profileModal').style.display = 'block';
    loadProfileToModal();
}

// Close Profile Modal
function closeProfileModal() {
    document.getElementById('profileModal').style.display = 'none';
}

// Preview Profile Picture
function previewProfilePic(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('profilePicPreview').src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

// Save Profile Data to localStorage
function saveProfile() {
    const profileData = {
        name: document.getElementById('profileName').value.trim(),
        school: document.getElementById('profileSchool').value.trim(),
        class: document.getElementById('profileClass').value,
        phone: document.getElementById('profilePhone').value.trim(),
        email: document.getElementById('profileEmail').value.trim(),
        picture: document.getElementById('profilePicPreview').src
    };

    if (!profileData.name) {
        alert('សូមបញ្ចូលឈ្មោះរបស់អ្នក!');
        return;
    }

    // រក្សាទុកនៅក្នុង localStorage
    localStorage.setItem('userProfile', JSON.stringify(profileData));
    
    // បង្ហាញ profile នៅលើទំព័រ
    displayProfile(profileData);
    
    // បិទ Modal
    closeProfileModal();
    
    alert('រក្សាទុក Profile ជោគជ័យ! ✅');
}

// Load Profile Data to Modal
function loadProfileToModal() {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
        const profile = JSON.parse(savedProfile);
        document.getElementById('profileName').value = profile.name || '';
        document.getElementById('profileSchool').value = profile.school || '';
        document.getElementById('profileClass').value = profile.class || '';
        document.getElementById('profilePhone').value = profile.phone || '';
        document.getElementById('profileEmail').value = profile.email || '';
        document.getElementById('profilePicPreview').src = profile.picture || 'https://via.placeholder.com/150';
    }
}

// Display Profile on Page
function displayProfile(profileData) {
    const profileDisplay = document.getElementById('profileDisplay');
    const profilePicDisplay = document.getElementById('profilePicDisplay');
    const profileNameDisplay = document.getElementById('profileNameDisplay');
    
    profilePicDisplay.src = profileData.picture || 'https://via.placeholder.com/50';
    profileNameDisplay.textContent = profileData.name;
    profileDisplay.style.display = 'flex';
    
    // បំពេញឈ្មោះទៅក្នុង input field
    document.getElementById('userName').value = profileData.name;
}

// Load Profile Data on Page Load
function loadProfileData() {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
        const profile = JSON.parse(savedProfile);
        displayProfile(profile);
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('profileModal');
    if (event.target === modal) {
        closeProfileModal();
    }
}

document.addEventListener('DOMContentLoaded', loadSubjects);