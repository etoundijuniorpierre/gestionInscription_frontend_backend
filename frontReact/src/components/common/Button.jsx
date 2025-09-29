import React from 'react';

const Button = ({ children, primary, secondary, tertiary, size, className = '', ...props }) => {

    const baseStyles = 'font-semibold transition duration-300 ease-in-out cursor-pointer flex items-center justify-center rounded-md';
    let typeStyles = '';
    let hoverActiveStyles = '';
    let sizeStyles = '';

    if (size === 'lg') {
        sizeStyles = 'px-8 py-3 text-[1.4375rem] flex-1';
    } else {
        sizeStyles = 'px-4 py-2 text-base';
    }

    if (primary) {
        typeStyles = 'bg-[#101957] text-white';
        hoverActiveStyles = 'hover:shadow-[0_0_10.74px_0_#101957] active:bg-[#585E89] active:shadow-[0_0_5.37px_0_#101957]';
    } else if (secondary) {
        typeStyles = 'bg-white text-[#101957] border border-[#101957]';
        hoverActiveStyles = 'hover:shadow-[0_0_10.74px_0_#101957] active:border-[#9FA3BC]';
    } else if (tertiary) {
        typeStyles = 'bg-[#10195726] text-[#101957] border border-[#101957]';
        hoverActiveStyles = 'hover:shadow-[0_3px_5px_0_#101957]';
    } else {
        typeStyles = 'bg-[#101957] text-white';
        hoverActiveStyles = 'hover:shadow-[0_0_10.74px_0_#101957] active:bg-[#585E89] active:shadow-[0_0_5.37px_0_#101957]';
    }

    const finalStyles = `${baseStyles} ${typeStyles} ${hoverActiveStyles} ${sizeStyles} ${className}`;

    return (
        <button className={finalStyles.trim()} {...props}>
            {children}
        </button>
    );
};

export default Button;