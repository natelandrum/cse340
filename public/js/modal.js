document.addEventListener('DOMContentLoaded', (event) => {
  const modal = document.getElementById("myModal");
  const btns = document.querySelectorAll(".modal-link");


  btns.forEach(btn => {
    btn.onclick = function(event) {
      event.preventDefault();
      modal.style.display = "block";

      var id = event.target.getAttribute('data-id');

      fetch('/inv/detail/' + id, {
        method: 'POST',
      })
      .then(response => {
        return response.text();
      })
      .then(data => {
        modal.querySelector('.modal-content').innerHTML = data;
      })
      .catch(error => {
        console.error('Error:', error);
      });
    }
  });

  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }
});

