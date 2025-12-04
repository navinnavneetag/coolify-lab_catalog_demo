import { TbLogout2 } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <>
      <nav className="py-1.5 px-4 flex text-xl justify-between items-center border-b">
        <div className="flex items-center gap-4">
          <img src="/pngegg.png" alt="logo" className="h-10 w-16" />
          <h1 className="font-semibold text-foreground">
            National Food Labs Database
          </h1>
        </div>
        <div className="flex gap-2 items-center justify-center">
          <Button onClick={handleLogout} variant="destructive" size="sm">
            <TbLogout2 size={24} />
            Logout
          </Button>
          <Avatar>
            <AvatarImage src="https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
