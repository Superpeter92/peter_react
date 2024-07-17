import { useAuth } from "../utils/store/useAuth";
import Card from "../components/UI/Card";
import AnimatedButton from "../components/UI/AnimatedButton";
import { IconEdit, IconKey } from "@tabler/icons-react";

const Profile: React.FC = () => {
  const { user } = useAuth((state) => state);
  const password = "•••••••••";
  return (
    <div className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-start bg-[url('assets/piramide.jfif')] bg-cover bg-center bg-no-repeat">
      <Card style="w-[90%] sm:w-[45%] mt-10 mb-10">
        <div className="my-10 text-center font-montserrat text-2xl font-medium uppercase text-purplue">
          Profilo
        </div>
        <div className="grid w-full grid-cols-1 gap-x-6 gap-y-5 sm:w-11/12 sm:grid-cols-2">
          <div className="flex flex-col items-center justify-center p-4">
            <div className="font-montserrat text-purplue">Nome</div>
            <div className="font-montserrat">{user?.nome} </div>
          </div>

          <div className="flex flex-col items-center justify-center p-4">
            <div className="font-montserrat text-purplue">Cognome</div>
            <div className="font-montserrat">{user?.cognome} </div>
          </div>
          <div className="flex flex-col items-center justify-center p-4">
            <div className="font-montserrat text-purplue">Email</div>
            <div className="font-montserrat">{user?.email} </div>
          </div>

          <div className="flex flex-col items-center justify-center p-4">
            <div className="font-montserrat text-purplue">Ruolo</div>
            <div className="font-montserrat capitalize">
              {user?.ruolo.nome === "admin" ? "Amministratore" : "Utente base"}{" "}
            </div>
          </div>

          <div className="flex flex-col items-center justify-center p-4">
            <div className="font-montserrat text-purplue">Password</div>
            <div className="font-montserrat">{password}</div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-y-4 sm:flex sm:flex-row sm:items-center sm:justify-center sm:gap-x-4">
          <AnimatedButton
            className="bg-purplue text-white hover:bg-purple-950"
            icon={<IconEdit />}
            onClick={() => {}}
          >
            Modifica
          </AnimatedButton>
          <AnimatedButton
            className="bg-darkPurplue text-white hover:bg-purple-200 hover:text-black"
            icon={<IconKey />}
            onClick={() => {}}
          >
            Modifica Password
          </AnimatedButton>
        </div>
      </Card>
    </div>
  );
};

export default Profile;
