<div key={props.hole.config.name+"velocity"+vel.depth} className="velocity-render">
    <h5>{vel.depth+"ft"}</h5>
    {
        editvelocity?
        <input type="number" 
            placeholder={vel.velocity} 
            value={velocity} 
            onChange={changeVelocity} 

        />
        :<h5 onClick={()=>setEditVelocity(!editvelocity)}>{vel.velocity}</h5>
    }
    {
        editvelocity?
        <button onClick={()=>handleChangeVelocity(index)} className="btn--flat">
            {/* {editinfo?"Confirm":"Edit"}  */}
            <i className="material-icons">
                done
            </i>
        </button>
        :""
    }
</div>