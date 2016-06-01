document.addEventListener('DOMContentLoaded', function() {
    var submit = document.getElementById('makeRequest');

    submit.addEventListener('click', function() {
      console.log('Success!');
      var result = document.getElementById('result')
      result.innerHTML = 'success';
    });
});

function foo( suffix ) {

    return 'cake';
}
