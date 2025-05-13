import DigitalClock from "./DigitalClock";

const Header = () => {
  return (
    <header className="bg-white border-b border-neutral-mid shadow-sm">
      <div className="container mx-auto px-4 py-3 flex flex-wrap items-center justify-between">
        <div className="flex items-center space-x-4">
          <DigitalClock />

          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-neutral-dark">
              SUGENG RAWUH
            </h1>
            <h2 className="text-xl md:text-2xl font-medium text-neutral-dark">
              DINAS PENDIDIKAN KOTA SALATIGA
            </h2>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
