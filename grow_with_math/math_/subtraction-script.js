const paths = {
  A: [
    'A_stage_one.gif',
    'A_stage_two.gif',
    'A_stage_three.gif',
    'A_stage_four.gif',
  ],
  B: [
    'B_stage_one.gif',
    'B_stage_two.gif',
    'B_stage_three.gif',
    'B_stage_four.gif',
  ],
  C: [
    'C_stage_one.gif',
    'C_stage_two.gif',
    'C_stage_three.gif',
    'C_stage_four.gif',
  ]
};


let currentAnswer = null;
const answerBox = document.getElementById('answer-box');
const feedback = document.getElementById('feedback');

const clickedImages = ['1'];

const images = document.querySelectorAll('.toggle-image');

const clickedList = document.getElementById('clicked-list');

let score = 0;
let chosenPath = null;
const evolutionImg = document.getElementById('evolution-img');
const scoreDisplay = document.getElementById('score');

const mathProblemDisplay = document.getElementById('math-problem');

function updateClickedList() {
    clickedList.innerHTML = '';
    clickedImages.forEach(imageId => {
        const listItem = document.createElement('li');
        listItem.textContent = `Image ${imageId}`;
        clickedList.appendChild(listItem);
    });
}

function generateRandomMathProblem() {
    if (clickedImages.length === 0) {
      mathProblemDisplay.innerHTML = '';
      currentAnswer = null;
      return;
    }
    const fromList = Number(clickedImages[Math.floor(Math.random() * clickedImages.length)]);
    const randomNum = Math.floor(Math.random() * 12) + 1;
    const op = '-';
    const [a, b] = Math.random() < 0.5 ? [fromList, randomNum] : [randomNum, fromList];
    
    currentAnswer = a - b;

    mathProblemDisplay.innerHTML = `
    <div class="equation">
      <div class="top">${' '} ${a}</div>
      <div class="bottom">${op} ${b}</div>
      <div class="line">────</div>
    </div>
  `;

  answerBox.value = '';
  feedback.textContent = '';
  feedback.className = '';
  answerBox.focus();

}

answerBox.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && currentAnswer !== null) {
      const userAnswer = Number(answerBox.value.trim());
  
      if (userAnswer === currentAnswer) {
        feedback.textContent = 'Correct!';
        feedback.className = 'correct';
        updateScore(1);
      } else {
        feedback.textContent = `Wrong! Answer: ${currentAnswer}`;
        feedback.className = 'incorrect';
        updateScore(-1);
      }
      scoreDisplay.textContent = `Score: ${score}`;
      setTimeout(() => {
        generateRandomMathProblem();
      }, 1500); 
    }
  });
    

images.forEach(image => {
    image.addEventListener('click', function() {
        const imageId = this.getAttribute('data-id');
        this.classList.toggle('darken');
        if (this.classList.contains('darken') && !clickedImages.includes(imageId)) {
            clickedImages.push(imageId);
        } 
        else if (!this.classList.contains('darken') && clickedImages.includes(imageId)) {
            const index = clickedImages.indexOf(imageId);
            clickedImages.splice(index, 1);
        }
        updateClickedList();
        generateRandomMathProblem();
    });
});

function updateScore(change) {
  score += change;
  scoreDisplay.textContent = `Score: ${score}`;

  if (score === 5 && !chosenPath) {
    // Pick a random path
    const keys = Object.keys(paths);
    chosenPath = keys[Math.floor(Math.random() * keys.length)];
    evolutionImg.src = `../images/sprites/${paths[chosenPath][0]}`;
  } else if (score > 5 && score <= 25 && chosenPath) {
    const level = Math.floor((score - 5) / 5);
    if (level >= 0 && level < paths[chosenPath].length) {
      evolutionImg.src = `../images/sprites/${paths[chosenPath][level]}`;
    }
  }

  //if (score >= 25) {
  //  evolutionImg.src = './images/evolution/win.png'; // Final image
  //  // Optional: stop the game or show a modal
  //}
}

updateClickedList();
generateRandomMathProblem();
