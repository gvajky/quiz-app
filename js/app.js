import Question from "./question.js";
import Quiz from "./quiz.js";

const App = (() => {
  //cache the DOM
  const quiz = document.querySelector(".quiz");
  const quizQuestion = document.querySelector(".quiz__question");
  const tracker = document.querySelector(".quiz__tracker");
  const tagline = document.querySelector(".quiz__tagline");
  const choices = document.querySelector(".quiz__choices");
  const progressInner = document.querySelector(".progress__inner");
  const warning = document.querySelector(".quiz__warning");
  const nextButton = document.querySelector(".next");
  const restart = document.querySelector(".restart");

  const q1 = new Question(
    "Which word starts with an A?",
    ["Apple", "Banana", "Citrus", "Donkey"],
    0
  )
  const q2 = new Question(
    "Which word starts with a B?",
    ["Citrus", "Banana", "Donkey", "Apple"],
    1
  )
  const q3 = new Question(
    "Which word starts with a C?",
    ["Apple", "Banana", "Citrus", "Donkey"],
    2
  )
  const q4 = new Question(
    "Which word starts with a D?",
    ["Citrus", "Banana", "Apple", "Donkey"],
    3
  )


  const myQuiz = new Quiz([q1, q2, q3, q4])

  const listeners = _ => {
    nextButton.addEventListener("click", function() {
      const selectedRadioElem = document.querySelector('input[name="choice"]:checked');
      if (selectedRadioElem) {
        const key = Number(selectedRadioElem.getAttribute("data-order"));
        myQuiz.guess(key);
        renderAll();
        warning.style.opacity = 0;
      } else {
        warning.style.opacity = 1;
      }
    });

    restart.addEventListener("click", function() {
      //1. reset the quiz
      myQuiz.reset();
      //2. renderAll
      renderAll();
      //3. restore the next button
      nextButton.style.opacity = 1;
      //4. reset the tagline
      tagline.innerHTML = `Pick an option below!`;
    });
  }


  const setValue = (elem, value) => {
    elem.innerHTML = value;
  }
  const renderQuestion = _ => {
    const question = myQuiz.getCurrentQuestion().question;
    setValue(quizQuestion, question);
  }

  const renderChoices = _ => {
    let markup = "";
    const currentChoices = myQuiz.getCurrentQuestion().choices;
    currentChoices.forEach((elem, index) => {
      markup += `
      <li class="quiz__choice">
        <input type="radio" name="choice" class="quiz__input" id="choice${index}" data-order= "${index}">
          <label for="choice${index}" class="quiz__label">
              <i></i>
              <span>${elem}</span>
          </label>
      </li>
      `
    }
    );
    setValue(choices, markup);
  }

  const renderTracker = _ => {
    let index = myQuiz.currentIndex;
    setValue(tracker, `${index+1} of ${myQuiz.questions.length}`)
  }

  const getPercentege = (num1, num2) => {
    return Math.round((num1/num2)*100);
  }

  const launch = (width, maxPercent) => {
    let loadingBar = setInterval(function() {
      if (width > maxPercent){
        clearInterval(loadingBar);
      }else{
        width++;
        progressInner.style.width = width + "%";
      }
    }, 3)
  }

  const renderProgress = _ => {
    //1. width
    const currentWidth = getPercentege(myQuiz.currentIndex, myQuiz.questions.length);
    //2. launch (0, width)
    launch(0, currentWidth);
  }

  const renderEndScreen = _ => {
    if (getPercentege(myQuiz.score, myQuiz.questions.length) === 100) {
      setValue(quizQuestion, `Great Job!`);
    }else if (getPercentege(myQuiz.score, myQuiz.questions.length) >= 50) {
      setValue(quizQuestion, `Not Bad, but try again for higher score.`);
    }else {
      setValue(quizQuestion, `Don't show your score to anyone, try again for higher score.`);
    };
    
    setValue(tagline, `Complete!`);
    setValue(tracker, `Your score: ${getPercentege(myQuiz.score, myQuiz.questions.length)}%`);
    nextButton.style.opacity = 0;
    renderProgress();
  }

  const renderAll = _ => {
    if (myQuiz.hasEnded()){
      //render end screen
      renderEndScreen();
    }else{
      //1. render the question
      renderQuestion();
      //2. render the choices elements
      renderChoices();
      //3. render tracker
      renderTracker();
      //4. render progress bar
      renderProgress();


    }
  }

  return {
    renderAll: renderAll,
    listeners: listeners
  }
})();

App.renderAll();
App.listeners();

