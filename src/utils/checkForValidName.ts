import { ens_normalize } from "@adraffy/ens-normalize";
import "@adraffy/ens-normalize";

export const checkForValidName = ({
  name,
}: {
  name: string | undefined;
}): { name: string | null; error: string | null } => {
  if (!name)
    return {
      name: null,
      error: "please enter a name",
    };
  try {
    return {
      name: ens_normalize(name),
      error: null,
    };
  } catch (error) {
    return {
      name: null,
      error: "invalid name",
    };
  }
};
