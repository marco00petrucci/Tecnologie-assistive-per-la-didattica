$(function () {
  // Recupera il carrello dal localStorage
  var cart = JSON.parse(localStorage.getItem("libri_prenotati")) || [];

  // Aggiorna la lista del carrello e la scritta "Il carrello è vuoto" se necessario
  function updateCartDisplay() {
    $('#cartItemsList').empty();

    if (!cart.length) {
      $('#cartItemsList').append('<li class="d-flex align-items-center mb-2">Il tuo carrello è vuoto.</li>');
      $('#checkoutBtn').hide(); // Nasconde il pulsante "Procedi con la prenotazione"
      $('#viewCartBtn').html(`<i class="fa-solid fa-cart-shopping mr-2"></i>Carrello vuoto`);
    }
    else {
      $('#viewCartBtn').removeClass("d-none");
      cart.forEach((book, index) => {
        $('#cartItemsList').append(`
          <li class="d-flex align-items-center mb-2">
            <img src="${book.image}" alt="${book.title}" width="50" class="mr-2">
            <span>${book.title}</span>
            <button class="btn btn-sm btn-danger ml-auto remove-btn" data-index="${index}">
              <i class="fa-solid fa-trash mr-2"></i> Rimuovi
            </button>
          </li>
        `);
      });
      $('#checkoutBtn').show(); // Mostra il pulsante "Procedi con la prenotazione"
      $('#viewCartBtn').html(`<i class="fa-solid fa-cart-shopping mr-2"></i>Visualizza carrello (${cart.length})`);
    }
  }

  // Rimozione di un libro dal carrello
  $('#cartItemsList').on('click', '.remove-btn', function () {
    cart.splice($(this).data('index'), 1);
    localStorage.setItem("libri_prenotati", JSON.stringify(cart));
    updateCartDisplay();
  });

  // Inizializzazione al caricamento
  updateCartDisplay();

  // Il pulsante Visualizza carrello mostra il modal
  $('#viewCartBtn').click(() => $('#cartModal').modal('show').removeAttr('inert'));

  // Prenota i libri
  $('#checkoutBtn').on('click', async function () {
    const { value: scelta } = await Swal.fire({
      title: 'Conferma la prenotazione',
      html: `
        <div class="custom-radio-group">
          <label class="custom-radio">
            <input type="radio" name="scelta" value="casa">
            <span class="radio-label"><i class="fa-solid fa-truck mr-2"></i>Ricevi a casa</span>
          </label>
          <label class="custom-radio">
            <input type="radio" name="scelta" value="biblioteca">
            <span class="radio-label"><i class="fa-solid fa-bookmark mr-2"></i>Ritira in biblioteca</span>
          </label>
        </div>
      `,
      showCancelButton: true,
      cancelButtonText: `<i class="fa-solid fa-times mr-2"></i>Torna indietro`,
      confirmButtonText: '<i class="fa-solid fa-circle-check mr-2"></i>Procedi',
      customClass: { confirmButton: 'btn-success' },
      preConfirm: () => {
        const scelta = document.querySelector('input[name="scelta"]:checked');
        if (!scelta) {
          Swal.showValidationMessage('Scegli una opzione, oppure torna indietro.');
        }
        return scelta ? scelta.value : null;
      },
      allowOutsideClick: false
    });

    if (scelta) {
      let successMessage = scelta === 'casa'
        ? 'Libri prenotati con successo, arriveranno presto a casa tua!'
        : 'Libri prenotati con successo, puoi ritirarli in biblioteca!';

      Swal.fire({
        icon: 'success',
        html: successMessage,
        color: '#343a40',
        customClass: { confirmButton: 'btn-success' },
      });

      localStorage.removeItem("libri_prenotati");
      $('#cartItemsList').empty().append('<li class="d-flex align-items-center mb-2">Il tuo carrello è vuoto.</li>');
      $('#viewCartBtn').html(`<i class="fa-solid fa-cart-shopping mr-2"></i>Carrello vuoto`);
      $('#checkoutBtn, #viewCartBtn').hide();
      $('#cartModal').modal('hide');
    }
  });

  // Esegui il codice solo sugli schermi superiori di 800px-> Mostra icona Go to Top quando la pagina viene scrollata di 500px
  if ($(window).width() > 800) {
    $(window).scroll(function () {
      if ($(document).scrollTop() > 100) $("#back-to-top").css("opacity", 1);
      else $("#back-to-top").css("opacity", 0);
    });
  }

  $(window).scroll(function () {
    if ($(this).scrollTop() > 50) $('.navbar').addClass('scrolled');
    else $('.navbar').removeClass('scrolled');
  });
});