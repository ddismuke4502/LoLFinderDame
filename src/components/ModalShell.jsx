import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function ModalShell({ title, children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const close = () => {
    if (location.state?.backgroundLocation) {
      navigate(-1);
      return;
    }
    navigate("/", { replace: true });
  };

  useEffect(() => {
    const onKeyDown = (e) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="modal__backdrop" onMouseDown={close}>
      <div className="modal__card" onMouseDown={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <h2 className="modal__title">{title}</h2>
          <button className="modal__close" onClick={close} aria-label="Close">
            ✕
          </button>
        </div>

        <div className="modal__body">{children}</div>
      </div>
    </div>
  );
}

export default ModalShell;