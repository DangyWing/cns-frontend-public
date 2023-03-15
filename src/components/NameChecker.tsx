import { useState } from "react";
import { checkForValidName } from "../utils/checkForValidName";
import { inputClasses } from "../styles/inputClasses";

export const NameChecker: React.FC = () => {
  const [nameToCheck, setNameToCheck] = useState<string | undefined>();

  const { name, error } = checkForValidName({ name: nameToCheck });

  return (
    <div className="text-center">
      - name checker -
      <input
        type="text"
        className={inputClasses}
        id="name"
        name="name"
        onChange={(e) => setNameToCheck(e.target.value)}
      />
      {!error && (
        <h1 className="">
          validated name
          <p className="rotate-180">^</p>
        </h1>
      )}
      {name != "" && <div className="">{name}</div>}
      {error && <div className="text-center text-cantoError">- {error} -</div>}
    </div>
  );
};
