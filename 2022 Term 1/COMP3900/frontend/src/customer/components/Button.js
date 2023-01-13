/*
  Definition for button component
*/
const Button = ({ type, text, onClick }) => {

  return (
    <button 
      onClick ={onClick} 
      className={`button ${type}`}>
        {text}
    </button>
  )
}

export default Button