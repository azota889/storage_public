const data = [
    {id:1,category:1,question:'how are you',answer:'i`m fine thank you, and you?'}
]
let itemFaq = document.querySelector('.cd-faq__item');
let itemFaqQuestion = document.querySelector(".cd-faq__trigger__question");
let itemFaqAnswer = document.querySelector(".text-content-answer");
data.forEach(item => {
    itemFaqQuestion.innerHTML  =item.question;
    itemFaqAnswer.innerHTML  =item.answer;
});