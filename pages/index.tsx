import type { NextPage } from "next";
import MTHeader from "../components/MTHeader";

const Home: NextPage = () => {
  return (
    <div className="flex flex-col	h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 justify-between content-center">
      <MTHeader />
    </div>
  );
};

export default Home;
