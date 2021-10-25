import Header from "../../components/Header";
import { Modal } from "../../components/Modal";
import { TagModal } from "../../components/TagModal";

const DashboardLayout = ({ children }) => {
  return (
    <>
      <Header />
      {children}
      <Modal />
      <TagModal />
    </>
  );
};

export default DashboardLayout;
