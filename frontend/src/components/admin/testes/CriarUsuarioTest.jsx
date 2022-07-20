import api from "../../../services/api";
import { SaudeContext } from "../../../Saude";
import React, { useContext, useState } from "react";

export default function CriarUsuarioTest() {
  const saudeContext = useContext(SaudeContext);
  const [nUsers, setNUsers] = useState(0);
  const [criandoUser, setCriandoUser] = useState("");

  const criarUsuario = (user) => {
    const token = localStorage.getItem("token");
    api
      .post(
        "/auth/user/create",
        {
          userToCreate: { ...user },
        },
        {
          headers: { authorization: "Bearer " + token },
        }
      )
      .then((succ) => {
        saudeContext.notify.success(
          `Usuário ${user.name} criado com sucesso!`,
          {
            position: "bottom-right",
          }
        );
      })
      .catch((err) => {
        console.log(err.response.data);
        saudeContext.notify.error(
          `Erro ao criar usuário: ${err.response.data.message}`,
          { position: "bottom-right" }
        );
      });
  };

  const generateUser = (count) => {
    let res = [];
    const getRandom = (range) => {
      return Math.floor(Math.random() * (range - 1));
    };

    const generateCpf = () => {
      return `${getRandom(999)}.${getRandom(999)}.${getRandom(999)}-${getRandom(
        99
      )}`;
    };

    const names = [
      "Jose",
      "Felipe",
      "Pereira",
      "Amanda",
      "Armino",
      "Yanina",
      "Dante",
      "Jónatan",
      "ErhanFaithe",
      "Krastyu",
      "Iulian",
      "BerryKristen",
      "Tiw",
      "İlhan",
      "MariannaGeordie",
      "Dolors",
      "Valkyrie",
      "LilyaZlatko",
      "Eliana",
      "Tàmhas",
      "Şehrazat",
    ];
    const email = ["@outlook.com", "@hotmail.com", "@bol.com", "@aperture.com"];

    const generateName = () => {
      return `${names[getRandom(names.length)]} ${
        names[getRandom(names.length)]
      } ${names[getRandom(names.length)]}`;
    };

    const generateEmail = () => {
      return `${names[getRandom(names.length)].toLowerCase()}.${names[
        getRandom(names.length)
      ].toLowerCase()}${email[getRandom(email.length)]}`;
    };
    for (let index = 0; index < count; index++) {
      res.push({
        name: generateName(),
        cpf: generateCpf(),
        email: generateEmail(),
        password: "pass" + getRandom(99999999),
        isAdmin: Math.random < 0.1,
        canUseFarmacia: Math.random() < 0.5,
        canUseMarcacao: Math.random() < 0.5,
      });
    }
    //"330.328.895-92"
    //"21765055"

    for (let user of res) {
      setCriandoUser(user.name);
      criarUsuario(user);
    }

    return res;
  };
  return (
    <div className="">
      <form
        action=""
        className="usuario-form"
        style={{ width: "auto" }}
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <button
          onClick={(e) => {
            console.log(generateUser(nUsers));
          }}
        >
          Criar Usuários
        </button>
        <div className="form-item">
          <label htmlFor="usuarios">
            Número de usuários aleatórios à serem criados
          </label>
          <input
            type="number"
            name="usuarios"
            id="usuarios"
            value={nUsers}
            onChange={(e) => {
              setNUsers(e.target.value);
            }}
          />
        </div>
        {criandoUser && `Criando Usuário: ${criandoUser}`}
      </form>
    </div>
  );
}
