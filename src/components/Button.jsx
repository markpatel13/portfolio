//old button code
// import React from 'react'

// const Button = ({text,className,id}) => {
//     return (
//         <a className={`${className ?? ''} cta-wrapper`}>
//             <div className="cta-button group">
//                 <div className="bg-circle">
//                     <p className='text'>{text}</p>
//                     <div className="arrow-wrapper">
//                         <img src="/images/arrow-down.svg" alt="arrow" />
//                     </div>
//                 </div>
//             </div>
//         </a>
//     )
// }

// export default Button
import React from "react";

const Button = ({ text, className = "", id }) => {
  return (
    <a 
    onClick={(e)=>{
      e.preventDefault();
      const target = document.getElementById('counter')

      if(target && id){
        const offset = window.innerHeight * 0.15;

        const top= target.getBoundingClientRect().top + window.scrollY - offset

        window.scrollTo({top,behavior:'smooth'})
      }
    }}
    id={id} className={`cta-wrapper ${className}`} href="#">
      <div className="cta-button">
        <span className="text">{text}</span>
      </div>
    </a>
  );
};

export default Button;
