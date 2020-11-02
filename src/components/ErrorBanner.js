import { useDispatch, useSelector } from 'react-redux'

const ErrorBanner = () => {
  return (
    <div
      className="relative top-1/10 right-0 bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4"
      role="alert"
    >
      <p className="font-bold">Be Warned</p>
      <p>Something not ideal might be happening.</p>
    </div>
  );
};

export default ErrorBanner