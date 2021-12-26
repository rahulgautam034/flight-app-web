function Date(props) {

    const formatDate = props.date.getFullYear() +"-"+(props.date.getMonth()+1)+"-"+ props.date.getDate()

    return (
        <div>{formatDate}</div>
    )
}

export default Date;