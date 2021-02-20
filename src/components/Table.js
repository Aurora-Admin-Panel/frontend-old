import React from 'react'


const Table = React.forwardRef(function Table(props, ref) {
  const { children, ...other } = props
  return (
    <div className="w-full">
      <table className="w-full whitespace-no-wrap" ref={ref} {...other}>
        {children}
      </table>
    </div>
  )
})

export default Table