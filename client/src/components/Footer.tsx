import logo from "../../images/logo.png";

const Footer = () => {
  return (
    <div className="w-full flex flex-col items-center p-6 gradient-bg-footer">
      <div className="w-full flex flex-col sm:flex-row justify-between items-center my-8">
        <div className="flex flex-[0.5] justify-center items-center mb-6 sm:mb-0">
          <img
            src={logo}
            alt="logo"
            className="w-24 transform hover:scale-110 transition duration-300 ease-in-out"
          />
        </div>

        <div className="flex flex-1 justify-evenly items-center flex-wrap w-full sm:w-auto space-y-4 sm:space-y-0">
          {["Market", "Exchange", "Tutorial", "Wallet", "News"].map((item) => (
            <p
              key={item}
              className="text-white text-lg text-center mb-0 mx-3 cursor-pointer hover:text-yellow-300 transition duration-200 ease-in-out !mt-2"
            >
              {item}
            </p>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center mt-8">
        <p className="text-white text-sm text-center">Come join us</p>
        <p className="text-white text-sm text-center mt-2 hover:text-yellow-300 transition duration-200 ease-in-out">
          info@binkoin.com
        </p>
      </div>

      <div className="w-full h-[0.25px] bg-gray-300 mt-8"></div>

      <div className="w-full flex flex-col sm:flex-row justify-between items-center mt-4 space-y-4 sm:space-y-0">
        <p className="text-white text-xs text-center">@binkoin 2024</p>
        <p className="text-white text-xs text-center">All rights reserved.</p>
      </div>
    </div>
  );
};

export default Footer;
