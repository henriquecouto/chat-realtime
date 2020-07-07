const generateGroupModal = (title, users, action, name = "") => {
  console.log(action);
  const modal = document.createElement("div");
  modal.id = "modal-new-group";
  modal.className = "modal";
  modal.innerHTML = `
  <div class="modal-content">
    <div class="modal-header">
      ${title}
      <i class="material-icons btn" onclick="closeModal('modal-new-group')">close</i>
    </div>
    <div class="modal-body">
      <form onsubmit="event.preventDefault()" class="new-group-form" id="form-modal-group">
        <div class="new-group-form-item">
          <input class="new-group-form-input" value="${name}" placeholder="Digite o nome do grupo..." maxlength="20" />
        </div>
        <p>
          Selecionar participantes:
        </p>
        <div class="new-group-form-users-list">
        ${users
          .map((user) => {
            return `
            <label class="new-group-form-users-list-user">
              <input type="checkbox" value="${user._id}" ${
              user.active ? "checked" : ""
            }>
              ${user.name}
            </label>`;
          })
          .join("")}
        </div>
      </form>
    </div>
    <div class='modal-footer'>
      <button 
        class="new-group-form-button" 
        onclick="${action.function}">
        ${action.name}
      </button>
    </div>
  </div>
  `;
  return modal;
};

const closeModal = (modalId) => {
  const modal = document.getElementById(modalId);
  modal.remove();
};
