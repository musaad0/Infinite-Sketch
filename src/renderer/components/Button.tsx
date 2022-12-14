import { ReactNode } from 'react';

const commonStyles =
  'rounded-md py-2.5 focus-visible:outline-primary transition-colors ease-in-out duration-400';

type TButtonVariant = 'primary' | 'muted' | 'primary_dark';

const buttonVariants: { [key in TButtonVariant]: string } = {
  primary: `bg-primary hover:bg-primary-dark text-secondary hover:text-secondary/95 ${commonStyles} disabled:cursor-default disabled:bg-primary/30 disabled:text-secondary/70`,
  muted: `bg-neutral-600 hover:bg-neutral-700 text-neutral-300/95 ${commonStyles}`,
  primary_dark: `bg-primary/30 fill-secondary/60 hover:bg-primary/50 ${commonStyles}`,
};

interface IProps {
  onClick?: () => unknown;
  children: ReactNode;
  variant?: TButtonVariant;
  className?: string;
  disabled?: boolean;
}

export default function Button({
  onClick,
  children,
  variant,
  className,
  disabled,
}: IProps) {
  return (
    <button
      onClick={onClick}
      type="button"
      disabled={disabled}
      className={` ${
        buttonVariants[variant || 'primary']
      } rounded-lg outline-none active:outline-none ${className || ''}
      `}
    >
      {children}
    </button>
  );
}
