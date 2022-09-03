import { Pagination } from "react-bootstrap";

function PaginationLogic(props) {
  const { current_page, max_pages, next_page, prev_page } = props.data;

  function handleClick(data) {
    switch(data){
        case "first":
            props.change(1)
            break
        case "prev":
            props.change(prev_page)
            break
        case "next":
            props.change(next_page)
            break
        case "last":
            props.change(max_pages)
            break
        default:
            props.change(data)
    }
  }

  const navOptions = [];
  let i = 1;
  while (i <= max_pages) {
    navOptions.push(i)
    i += 1;
  }


  const navItems = navOptions.map((index, idx) => {
    return (
        <Pagination.Item key={idx} onClick={() => handleClick(index)} active={current_page === index ? true : false } >{index}</Pagination.Item>
    )
  })

  return (
    <Pagination size="sm">
      {props.data.prev_page ? (
        <Pagination.First onClick={() => handleClick("first")} />
      ) : (
        ""
      )}
      {props.data.prev_page ? (
        <Pagination.Prev onClick={() => handleClick("prev")} />
      ) : (
        ""
      )}
      {navItems}
      {props.data.next_page ? (
        <Pagination.Next onClick={() => handleClick("next")} />
      ) : (
        ""
      )}
      {props.data.next_page ? (
        <Pagination.Last onClick={() => handleClick("last")} />
      ) : (
        ""
      )}
    </Pagination>
  );
}

export default PaginationLogic;
