const questionnumber = document.getElementById("questionnumber");

var questionNumber = 1 ;
$(function() {
    // Remove button click
    $(document).on(
        'click',
        '[data-role="dynamic-fields"] > .form-inline [data-role="remove"]',
        function(e) {
            e.preventDefault();
            $(this).closest('.form-inline').remove();
            var questions = document.querySelectorAll("div.question");
            for(var i = 0; i < questions.length; i++){
                questionState = 'questions[' + i + ']'
                console.log(questionState)
                questions[i].querySelectorAll('textarea.question').name = questionState;
                var answers = questions[i].querySelectorAll('textarea.answer');
                for(var a = 0; a < answers.length; a++){
                    answers[a].name = 'choices['+i+'][]';
                }
        
            }
        }
    );
    // Add button click
    $(document).on(
        'click',
        '[data-role="dynamic-fields"] > .form-inline [data-role="add"]',
        function(e) {
            questionNumber++ ;
            questionnumber.innerHTML = "Question # " + questionNumber  ;
            e.preventDefault();
            var container = $(this).closest('[data-role="dynamic-fields"]');
            new_field_group = container.children().filter('.form-inline:first-child').clone();
            new_field_group.find('input').each(function(){
                $(this).val('');
            });
            container.append(new_field_group);
            var questions = document.querySelectorAll("div.question");
            for(var i = 0; i < questions.length; i++){
            questions[i].querySelector('textarea.question').name = 'questionstatement['+i+']';
            var answers = questions[i].querySelectorAll('textarea.answer');
            for(var a = 0; a < answers.length; a++){
                answers[a].name = 'choice['+i+'][]';
            }
        
            }
        }
    );
});
