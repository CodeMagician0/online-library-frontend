interface DialogProps {
  show: boolean;
  onClose: () => void;
  title: string;
  message: string;
}

export const Dialog: React.FC<DialogProps> = ({
  show,
  onClose,
  title,
  message,
}) => {
  return (
    <div
      className={`modal fade ${show ? "show" : ""}`}
      style={{ display: show ? "block" : "none" }}
      // tabIndex={-1}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="modalLabel">
              {title}
            </h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">{message}</div>
          <div className="modal-footer">
            <button
              type="button"
              className="main-color btn btn-secondary"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
