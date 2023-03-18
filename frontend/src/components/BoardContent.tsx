import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
// Components
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Board from "./Board";
import DashSkeletonLoader from "../misc/DashSkeletonLoader";
//Redux
import { useAppSelector, useAppDispatch } from "../redux/app/hooks";
import { setUserBoards } from "../redux/features/dashboardSlice";
// Misc.
import axios from "axios";

function BoardContent() {
  //STATES
  const [fetching, setFetching] = useState(true);

  // Redux
  const dispatch = useAppDispatch();

  // PARAMS
  const { uid } = useParams<{
    uid: string;
  }>();

  const navigate = useNavigate();

  const fetchBoards = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/user_boards/${uid}`
      );
      dispatch(setUserBoards(res.data.boards));
      if (res.data.boards.length === 0) {
        navigate(`/${uid}/b/`);
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setTimeout(() => setFetching(false), 500);
    }
  };

  // Get data from backend
  useEffect(() => {
    fetchBoards();
  }, []);
  if (fetching) {
    return <DashSkeletonLoader />;
  }
  return (
    <div className="flex flex-col h-screen">
      <Sidebar  />
      <Navbar />
      <Board />
    </div>
  );
}
export default BoardContent;
