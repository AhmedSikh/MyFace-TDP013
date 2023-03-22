import "./notFound.css";

export default function NotFound() {
    return (
        <>
            <div className="notFound">
                <div className="notFoundWrapper">
                    <div className="notFoundLeft">
                        <h3 className="notFoundLogo">MyFace</h3>
                    </div>

                    <div className="notFoundRight">
                        <h1 className="notFoundMessage">404: The page you're looking for does not appear to exist.</h1>
                    </div>
                </div>
            </div>
        </>
    );
}