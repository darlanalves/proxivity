document.addEventListener('DOMContentLoaded', function () {
  const placeholder = /{([^}]+)}/g;

  const updateButton = document.querySelector('.btn-update');

  updateButton.addEventListener('click', updateList);

  async function updateList() {
    try {
      const activeItem = await fetch('/active').then((r) => r.text());
      const list = await fetch('/list').then((r) => r.json());
      updateOptions(list, activeItem);
    } catch (error) {
      console.log(error);
    }
  }

  function updateOptions(list, activeItem) {
    const template = document.getElementById('items');
    const inputList = document.querySelector('.item-list');
    const templateText = template.cloneNode(true).innerHTML;

    inputList.innerHTML = '';

    list.forEach((location) => {
      inputList.innerHTML += templateText.replace(placeholder, location);
    });

    inputList.querySelector(`[data-location="${activeItem}"]`).checked = true;
  }

  updateList();
});

async function selectItem(input) {
  const location = input.dataset.location;
  await fetch('/switch/' + location);
}
