import { useForm } from 'react-hook-form';

import { Button } from '../../components/common/button';
import { FormError } from '../../components/common/form-error';

interface ILoginScreenProps {
  email: string;
  password: string;
}

const LoginScreen = (): JSX.Element => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ILoginScreenProps>({
    mode: 'onChange',
  });

  const onSubmit = (): void => {
    console.log('Login...');
  };

  return (
    <div className="flex flex-col items-center h-screen mt-10 lg:mt-28">
      <div className="flex flex-col items-center w-full max-w-screen-sm px-5">
        <h4 className="w-full mb-5 text-3xl font-medium text-left">Login</h4>
        <form onSubmit={handleSubmit(onSubmit)} className="grid w-full gap-3 mt-5 mb-5">
          <input
            {...register('email', {
              required: 'Email is required',
              pattern:
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            })}
            name="email"
            required
            type="email"
            placeholder="Email"
            className="w-full px-4 py-3 transition duration-300 border border-gray-300 rounded-lg ring-red-200 focus:ring-4 focus:outline-none glass focus:shadow-xl"
          />
          {errors.email?.type === 'pattern' && (
            <FormError errorMessage={'Please enter a valid email'} />
          )}
          {errors.email?.message && <FormError errorMessage={errors.email?.message} />}
          <input
            {...register('password', {
              required: 'Password is required',
            })}
            required
            name="password"
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 transition duration-300 border border-gray-300 rounded-lg ring-red-200 focus:ring-4 focus:outline-none glass focus:shadow-xl"
          />
          {errors.password?.message && <FormError errorMessage={errors.password?.message} />}
          <Button canClick={isValid} loading={false} actionText={'Log in'} />
        </form>
        <div>New to Platform? </div>
      </div>
    </div>
  );
};

export default LoginScreen;
