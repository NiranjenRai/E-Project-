/* -------------------------
   Polished project JS
   - filter products
   - add-to-order + render order table
   - calculate totals (subtotal, tax, total)
   - checkout form validation + success
   - feedback form validation + success
   - gallery lightbox
   ------------------------- */


document.addEventListener('DOMContentLoaded', () => {
  // PRODUCTS -> build JS products array from DOM
  const productCards = Array.from(document.querySelectorAll('.card-product'));
  const products = productCards.map(card => ({
    title: card.dataset.title,
    price: Number(card.dataset.price)
  }));


  // ORDER TABLE rendering
  const orderTable = document.getElementById('orderTable');
  function renderOrderTable() {
    orderTable.innerHTML = '';
    products.forEach((p, idx) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${p.title}</td>
        <td>Rs. ${p.price}</td>
        <td><input type="number" min="0" value="0" class="form-control form-control-sm qty" data-idx="${idx}"></td>
        <td class="sub">Rs. 0</td>
      `;
      orderTable.appendChild(tr);
    });
  }
  renderOrderTable();


  // Filter
  const filter = document.getElementById('categoryFilter');
  filter && filter.addEventListener('change', e => {
    const cat = e.target.value;
    productCards.forEach(card => {
      const parent = card.closest('.col-md-4') || card.parentElement;
      parent.style.display = (cat === 'all' || card.dataset.category === cat) ? '' : 'none';
    });
  });


  // Add-to-order
  document.querySelectorAll('.add-to-order').forEach((btn, idx) => {
    btn.addEventListener('click', () => {
      const input = orderTable.querySelector(`input.qty[data-idx="${idx}"]`);
      if (input) {
        input.value = Number(input.value || 0) + 1;
        updateTotals();
      }
      // quick visual feedback
      btn.classList.add('btn-success');
      setTimeout(() => btn.classList.remove('btn-success'), 700);
    });
  });


  // Calculate totals
  const subtotalEl = document.getElementById('subtotal');
  const taxEl = document.getElementById('tax');
  const totalEl = document.getElementById('total');


  function updateTotals() {
    let subtotal = 0;
    orderTable.querySelectorAll('tr').forEach(tr => {
      const input = tr.querySelector('input.qty');
      const idx = Number(input.dataset.idx);
      const qty = Math.max(0, Number(input.value) || 0);
      const price = products[idx].price || 0;
      const sub = qty * price;
      tr.querySelector('.sub').innerText = 'Rs. ' + sub.toFixed(0);
      subtotal += sub;
    });
    const tax = Math.round(subtotal * 0.10);
    const total = Math.round(subtotal + tax);
    subtotalEl.innerText = 'Rs. ' + subtotal.toFixed(0);
    taxEl.innerText = 'Rs. ' + tax.toFixed(0);
    totalEl.innerText = 'Rs. ' + total.toFixed(0);
    return {subtotal, tax, total};
  }


  document.getElementById('calcOrder').addEventListener('click', updateTotals);
  orderTable.addEventListener('input', (e) => { if (e.target.matches('input.qty')) updateTotals(); });


  // CHECKOUT form handling
  const checkoutForm = document.getElementById('checkoutForm');
  checkoutForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!checkoutForm.checkValidity()) {
      checkoutForm.classList.add('was-validated');
      return;
    }
    // ensure user calculated totals
    const totals = updateTotals();
    if (totals.subtotal === 0) {
      alert('Please add product quantities and calculate total before placing order.');
      return;
    }
    document.getElementById('coSuccess').classList.remove('d-none');
    // optional: show order summary in console for teacher
    console.log('ORDER (demo):', {
      name: document.getElementById('coName').value,
      email: document.getElementById('coEmail').value,
      phone: document.getElementById('coPhone').value,
      address: document.getElementById('coAddress').value,
      totals
    });
    setTimeout(() => {
      checkoutForm.reset();
      checkoutForm.classList.remove('was-validated');
      // reset order quantities
      orderTable.querySelectorAll('input.qty').forEach(i => i.value = 0);
      updateTotals();
    }, 900);
  });


  // FEEDBACK form handling
  const fbForm = document.getElementById('feedbackForm');
  fbForm && fbForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!fbForm.checkValidity()) { fbForm.classList.add('was-validated'); return; }
    document.getElementById('fbSuccess').classList.remove('d-none');
    setTimeout(()=> { fbForm.reset(); fbForm.classList.remove('was-validated'); }, 800);
  });


  // GALLERY lightbox
  const lightboxModal = new bootstrap.Modal(document.getElementById('lightboxModal'));
  document.querySelectorAll('.gallery-img').forEach(img => {
    img.addEventListener('click', () => {
      document.getElementById('lightboxImg').src = img.getAttribute('data-src') || img.src;
      lightboxModal.show();
    });
  });


  // Accessibility: clear lightbox src on hide (performance)
  document.getElementById('lightboxModal').addEventListener('hidden.bs.modal', () => {
    document.getElementById('lightboxImg').src = '';
  });


  // small fade-in after load
  document.querySelectorAll('.fade-up').forEach((el, i) => {
    el.style.animationDelay = (i*60) + 'ms';
  });
});