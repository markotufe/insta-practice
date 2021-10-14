import Header from "../../components/Header";
import { Modal } from "../../components/Modal";

const DashboardLayout = ({ children }) => {
  return (
    <>
      <Header />
      {children}
      <Modal />
    </>
  );
};

export default DashboardLayout;
