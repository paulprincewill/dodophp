<div id="chat">
    <div id="messages" dd_load="app/demo_chat/chat" dd_append='yes' dd_pagination="no">
        
        <div dd_checkFor="sender">

            <div dd_if='you' class='each_message'>
                <div>
                    <span dd_display="sender_name" class="dd_shortline"></span>
                    <p dd_display='message'>
                        <span class="dd_longline"></span>
                        <span class="dd_shortline"></span>
                    </p>
                </div>
            </div>

            <div dd_if='not_you' class='each_message'>
                <div>
                    <span dd_display="sender_name" class="dd_shortline"></span>
                    <p dd_display='message'>
                        <span class="dd_longline"></span>
                        <span class="dd_shortline"></span>
                    </p>
                </div>
            </div>
            
        </div>
        
    </div>
    
    <form class="textarea" action="app/demo_chat/send_message" dd_submit="yes" dd_bindResult="#messages">
        <textarea placeholder="Type in message" name="message"></textarea>
        <input type="submit" value="Send">
    </form>
</div>