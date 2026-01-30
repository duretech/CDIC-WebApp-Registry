
export function removeSpacetoLowerCase(string) {
    if(string){
        return string.trim().toLowerCase().split(' ').join('');
    }else{
        return '';
    }
}

export function setPeerToPeerChatRoom(sendId, receiptId) {
    if(sendId < receiptId) {
        return `${sendId}-${receiptId}`;
    } else if(sendId > receiptId) {
        return `${receiptId}-${sendId}`;
    } else {
        return `${sendId}-${receiptId}`;
    }
    
}
