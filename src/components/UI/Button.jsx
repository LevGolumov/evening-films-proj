function Button(props) {
  return (
    <button
      type={props.type || 'button'}
      className={props.className ? `button ${props.className}` : `button`}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
}

export default Button;
