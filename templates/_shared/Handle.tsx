import { tokens } from "../../brand/tokens";

export type HandleProps = {
  nickname: string;
};

export function Handle({ nickname }: HandleProps) {
  const label = nickname === tokens.brand.handle ? tokens.brand.author : nickname;
  return <div className="handle">{label}</div>;
}
