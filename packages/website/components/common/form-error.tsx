interface IFormErrorProps {
  errorMessage: string;
}

export const FormError: React.FC<IFormErrorProps> = ({ errorMessage }): JSX.Element => (
  <span role="alert" className="font-medium text-red-500">
    {errorMessage}
  </span>
);
