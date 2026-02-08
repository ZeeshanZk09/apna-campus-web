export default function Logout({ handleClick }: { handleClick: () => void }) {
  return (
    <button className="z-50" type="button" onClick={handleClick}>
      {/* { (<LucideLogOut/>) ?? "LogOut"}  */}
      LogOut
    </button>
  );
}
