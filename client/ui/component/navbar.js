import swal from 'sweetalert2';

Template.navbar.events({
    'click .calculate-IS': function () {
        swal.setDefaults({
            confirmButtonText: 'Suivant &rarr;',
            showCancelButton: true,
            cancelButtonText: 'Annuler',
            animation: true,
            progressSteps: ['1', '2', '3'],
            type: 'question',
            reverseButtons: true
        });

        var steps = [
            {title: "Question 1", text: "Chiffre d'affaires annuel hors taxes inférieur ou égal à 7 630 000 € ?"},
            {title: "Question 2", text: "Capital détenu pour au moins 75% par des personnes physiques ?"},
            {title: "Question 3", text: "Capital entièrement versé par les associés ?"}

        ];

        swal.queue(steps).then(function() {
            swal.resetDefaults();
            swal({
                title: 'Vous êtes imposable à 15% sur l\'IS',
                text: 'sur les 38 120 premiers € du résultat fiscal.',
                confirmButtonText: 'Calculer l\'IS',
                showCancelButton: false
            });
        }, function() {

            swal.resetDefaults();
        })
    }    
});
