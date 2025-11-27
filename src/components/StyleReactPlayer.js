import ReactPlayer from 'react-player';

export function StyleReactPlayer(props){
    return(
        <div>
            <ReactPlayer 
                // playsinline // very very imp prop
                pip={props.pip}
                light={props.light}
                controls={props.controls}
                muted={props.muted}
                playing={props.playing}
                //
                url={props.url}
                //
                height={props.height}
                width={props.width}
                />
        </div>
    )
}