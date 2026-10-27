import React from 'react';

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, recipe, isDeleting }) => {
  if (!isOpen || !recipe) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container confirm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="confirm-icon-wrapper">
          <span className="confirm-icon">🗑️</span>
        </div>

        <h3 className="confirm-title">Delete Recipe</h3>
        <p className="confirm-message">
          Are you sure you want to remove <strong>"{recipe.name}"</strong>?
          This action will permanently delete the recipe from your database.
        </p>

        <div className="modal-footer confirm-footer">
          <button
            type="button"
            className="btn btn-outline"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Yes, Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
