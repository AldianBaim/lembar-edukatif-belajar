
function Layout({children}) {

return (
    <div className="row justify-content-center p-3">
			<div className="col-lg-4 py-3">
				{children}
			</div>
    </div>
  );
}

export default Layout;
