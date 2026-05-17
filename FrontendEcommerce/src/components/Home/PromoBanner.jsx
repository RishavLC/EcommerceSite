export default function PromoBanner() {
  return (
    <>
    <div className="banner">
      <h2 className="bnr-heading">🔥 Mega Sale Up to 50% Off</h2>
      <button className="bnr-btn">Shop Now</button>
    </div>
    <style>{`
    .banner {
      margin: 40px;
      padding: 40px;
      background-color: #0f172a;
      color: #fff;
      border-radius: 16px;
      text-align: center;
    }
    .bnr-heading{
    font-style: oblique;
    }
    .bnr-btn{
    border-radius: 5px; 
    background-color: #ff8d02;
    padding: 5px;
    }
    `}
      </style>
    </>
  
  )
}