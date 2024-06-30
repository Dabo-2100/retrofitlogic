import noUserImg from "@/assets/user.png";

export default function Comment(props) {
  return (
    <div className="col-12 bg-dark text-white rounded d-flex flex-wrap p-3">
      <div className="col-12 d-flex justify-content-between align-items-center">
        <div className="d-flex gap-3 align-items-center">
          <img src={noUserImg} height={30} />
          <p className="mb-0">{props.username}</p>
        </div>
        <p>{props.date}</p>
      </div>
      <hr className="col-12" />
      <h4 className="col-12 d-flex mb-0">{props.content}</h4>
    </div>
  );
}
