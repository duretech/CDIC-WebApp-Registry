import React, { useState, useEffect } from 'react'

 export default function OUMapping (props) {
    let OUMappingObject = {
        'DskbnoxcNC6': {'id': 'DskbnoxcNC6', 'child': 'HcA6RZGtYAM', 'parent': '', 'type': 'region', 'reset': ['HcA6RZGtYAM'], 'level': 3},
        'HcA6RZGtYAM': {'id': 'HcA6RZGtYAM','child': 'VuL6xRU1sew', 'parent': 'DskbnoxcNC6'},
        'VuL6xRU1sew': {'id': 'VuL6xRU1sew','child': '', 'parent': 'HcA6RZGtYAM'},
        // 'ZHoqyBa59km': {'id': 'ZHoqyBa59km', 'child': '', 'parent': '', 'type': 'region', 'reset': ['']},
        // 'QdPbEoPdWyo': {'id': 'QdPbEoPdWyo', 'child': '', 'parent': '', 'type': 'region', 'reset': ['']},
        //transfer in ou mapping
        /*'bMDp6ZvSiy4': {'id': 'bMDp6ZvSiy4','child': 'YiOSbdp8Kwp', 'parent': '','type': 'region', 'level': 2},
        'YiOSbdp8Kwp': {'id': 'YiOSbdp8Kwp','child': 'Q0YFqTAP52V', 'parent': 'bMDp6ZvSiy4'},
        'Q0YFqTAP52V': {'id': 'Q0YFqTAP52V','child': 'cGxGegt4j6Y', 'parent': 'YiOSbdp8Kwp'},
        'cGxGegt4j6Y': {'id': 'cGxGegt4j6Y','child': '', 'parent': 'Q0YFqTAP52V'},*/
        
        //this is for transfer in transfer out OU mapping
        /*'YLeE8d0YZkf': {'id': 'YLeE8d0YZkf','child': 'iKLvfRnf4WH', 'parent': '','type': 'region', 'level': 2},
        'iKLvfRnf4WH': {'id': 'iKLvfRnf4WH','child': 'qtSo6YjkUj6', 'parent': 'YLeE8d0YZkf'},
        'qtSo6YjkUj6': {'id': 'qtSo6YjkUj6','child': 'v96Y3OwzAuM', 'parent': 'iKLvfRnf4WH'},
        'v96Y3OwzAuM': {'id': 'v96Y3OwzAuM','child': '', 'parent': 'qtSo6YjkUj6'},*/
    
        //Testing referral ou mapping
        /*'mj9S9NP1YNO': {'id': 'mj9S9NP1YNO','child': 'UnclrtBql0m', 'parent': '','type': 'region', 'level': 2},
        'UnclrtBql0m': {'id': 'UnclrtBql0m','child': 'ZpJfie0visa', 'parent': 'mj9S9NP1YNO'},
        'ZpJfie0visa': {'id': 'ZpJfie0visa','child': 'WlF4ogImXAx', 'parent': 'UnclrtBql0m'},
        'WlF4ogImXAx': {'id': 'WlF4ogImXAx','child': '', 'parent': 'ZpJfie0visa'},*/
        
        //country reg
        'SiBsB9zxBSP': {'id': 'SiBsB9zxBSP', 'child': 'B2ll6Kk3anQ' , 'parent': '','type': 'region', 'level': 2},
        'B2ll6Kk3anQ': {'id': 'B2ll6Kk3anQ', 'child': 'sdH4FMfRlXA' , 'parent': 'SiBsB9zxBSP'}, //province
        'sdH4FMfRlXA': {'id': 'sdH4FMfRlXA', 'child': 'Kdk1Sfm48Rc' , 'parent': 'B2ll6Kk3anQ'}, //District
        'Kdk1Sfm48Rc': {'id': 'Kdk1Sfm48Rc', 'child': '' , 'parent': 'sdH4FMfRlXA'}, //Facility
        
        //testing referal
        'mj9S9NP1YNO': {'id': 'mj9S9NP1YNO', 'child': 'UnclrtBql0m' , 'parent': '','type': 'region', 'level': 2},
        'UnclrtBql0m': {'id': 'UnclrtBql0m', 'child': 'ZpJfie0visa' , 'parent': 'mj9S9NP1YNO'}, //province
        'ZpJfie0visa': {'id': 'ZpJfie0visa', 'child': 'WlF4ogImXAx' , 'parent': 'UnclrtBql0m'}, //District
        'WlF4ogImXAx': {'id': 'WlF4ogImXAx', 'child': '' , 'parent': 'ZpJfie0visa'}, //Facility

        //sample
        'KWGsCG6974A': {'id': 'KWGsCG6974A', 'child': 'GHZ7ERbr3Cz' , 'parent': '','type': 'region', 'level': 2},
        'GHZ7ERbr3Cz':{'id': 'GHZ7ERbr3Cz', 'child': 'g23MMzoV9ha' , 'parent': 'KWGsCG6974A'}, //province
        'g23MMzoV9ha':{'id': 'g23MMzoV9ha', 'child': 'cRuxx0UEunD' , 'parent': 'GHZ7ERbr3Cz'}, //District
        'cRuxx0UEunD':{'id': 'cRuxx0UEunD', 'child': '' , 'parent': 'g23MMzoV9ha'}, //Facility 
        
        // transfer out mapping
        'YLeE8d0YZkf': {'id': 'YLeE8d0YZkf','child': 'iKLvfRnf4WH', 'parent': '','type': 'region', 'level': 2},
        'iKLvfRnf4WH':{'id': 'iKLvfRnf4WH', 'child': 'qtSo6YjkUj6' , 'parent': 'YLeE8d0YZkf'}, //province
        'qtSo6YjkUj6':{'id': 'qtSo6YjkUj6', 'child': 'v96Y3OwzAuM' , 'parent': 'iKLvfRnf4WH'}, //District
        'v96Y3OwzAuM':{'id': 'v96Y3OwzAuM', 'child': '' , 'parent': 'qtSo6YjkUj6'}, //Facility
        
        // transfer in mapping
        'bMDp6ZvSiy4': {'id': 'bMDp6ZvSiy4','child': 'YiOSbdp8Kwp', 'parent': '','type': 'region', 'level': 2},
        'YiOSbdp8Kwp': {'id': 'YiOSbdp8Kwp', 'child': 'Q0YFqTAP52V' , 'parent': 'bMDp6ZvSiy4'}, //province
        'Q0YFqTAP52V': {'id': 'Q0YFqTAP52V', 'child': 'cGxGegt4j6Y' , 'parent': 'YiOSbdp8Kwp'}, //District
        'cGxGegt4j6Y': {'id': 'cGxGegt4j6Y', 'child': '' , 'parent': 'Q0YFqTAP52V'} //Facility

    }
    /*
    //pakistan ZyweqRVeQFD
    if(props && props['SiBsB9zxBSP'] == "ZyweqRVeQFD") {
        OUMappingObject['SiBsB9zxBSP'] = {'id': 'SiBsB9zxBSP', 'child': 'B2ll6Kk3anQ' , 'parent': '','type': 'region', 'level': 2} //country
        OUMappingObject['B2ll6Kk3anQ'] = {'id': 'B2ll6Kk3anQ', 'child': 'sdH4FMfRlXA' , 'parent': 'SiBsB9zxBSP'} //province
        OUMappingObject['sdH4FMfRlXA'] = {'id': 'sdH4FMfRlXA', 'child': 'VIA6HQwtZsK' , 'parent': 'B2ll6Kk3anQ'} //District
        OUMappingObject['VIA6HQwtZsK'] = {'id': 'VIA6HQwtZsK', 'child': 'qGqahWT8Qax' , 'parent': 'sdH4FMfRlXA'} //Tehsil
        OUMappingObject['qGqahWT8Qax'] = {'id': 'qGqahWT8Qax', 'child': 'Kdk1Sfm48Rc' , 'parent': 'VIA6HQwtZsK'} //UC
        OUMappingObject['Kdk1Sfm48Rc'] = {'id': 'Kdk1Sfm48Rc', 'child': '' , 'parent': 'qGqahWT8Qax'} //Facility
        
    }
    //paksistan testing referal
    if(props && props['mj9S9NP1YNO'] == "ZyweqRVeQFD") {
        OUMappingObject['mj9S9NP1YNO'] = {'id': 'mj9S9NP1YNO', 'child': 'UnclrtBql0m' , 'parent': '','type': 'region', 'level': 2} //country
        OUMappingObject['UnclrtBql0m'] = {'id': 'UnclrtBql0m', 'child': 'ZpJfie0visa' , 'parent': 'mj9S9NP1YNO'} //province
        OUMappingObject['ZpJfie0visa'] = {'id': 'ZpJfie0visa', 'child': 'dcxFSv6JFtu' , 'parent': 'UnclrtBql0m'} //District
        OUMappingObject['dcxFSv6JFtu'] = {'id': 'dcxFSv6JFtu', 'child': 'jOJszKYw2Jq' , 'parent': 'ZpJfie0visa'} //Tehsil
        OUMappingObject['jOJszKYw2Jq'] = {'id': 'jOJszKYw2Jq', 'child': 'WlF4ogImXAx' , 'parent': 'dcxFSv6JFtu'} //UC
        OUMappingObject['WlF4ogImXAx'] = {'id': 'WlF4ogImXAx', 'child': '' , 'parent': 'jOJszKYw2Jq'} //Facility
        
    }
    //paksistan sample
    if(props && props['KWGsCG6974A'] == "ZyweqRVeQFD") {
        OUMappingObject['KWGsCG6974A'] = {'id': 'KWGsCG6974A', 'child': 'GHZ7ERbr3Cz' , 'parent': '','type': 'region', 'level': 2} //country
        OUMappingObject['GHZ7ERbr3Cz'] = {'id': 'GHZ7ERbr3Cz', 'child': 'g23MMzoV9ha' , 'parent': 'KWGsCG6974A'} //province
        OUMappingObject['g23MMzoV9ha'] = {'id': 'g23MMzoV9ha', 'child': 'UnKDtvAAWYs' , 'parent': 'GHZ7ERbr3Cz'} //District
        OUMappingObject['UnKDtvAAWYs'] = {'id': 'UnKDtvAAWYs', 'child': 'PsAP1cIdah1' , 'parent': 'g23MMzoV9ha'} //Tehsil
        OUMappingObject['PsAP1cIdah1'] = {'id': 'PsAP1cIdah1', 'child': 'cRuxx0UEunD' , 'parent': 'UnKDtvAAWYs'} //UC
        OUMappingObject['cRuxx0UEunD'] = {'id': 'cRuxx0UEunD', 'child': '' , 'parent': 'PsAP1cIdah1'} //Facility
        
    }

    //pakistan YLeE8d0YZkf - transfer out mapping
    if(props && props['YLeE8d0YZkf'] == "ZyweqRVeQFD") {
        OUMappingObject['YLeE8d0YZkf'] = {'id': 'YLeE8d0YZkf', 'child': 'iKLvfRnf4WH' , 'parent': '','type': 'region', 'level': 2} //country
        OUMappingObject['iKLvfRnf4WH'] = {'id': 'iKLvfRnf4WH', 'child': 'qtSo6YjkUj6' , 'parent': 'YLeE8d0YZkf'} //province
        OUMappingObject['qtSo6YjkUj6'] = {'id': 'qtSo6YjkUj6', 'child': 'mFD0crtOoON' , 'parent': 'iKLvfRnf4WH'} //District
        OUMappingObject['mFD0crtOoON'] = {'id': 'mFD0crtOoON', 'child': 'XX95LrNrYxR' , 'parent': 'qtSo6YjkUj6'} //Tehsil
        OUMappingObject['XX95LrNrYxR'] = {'id': 'XX95LrNrYxR', 'child': 'v96Y3OwzAuM' , 'parent': 'mFD0crtOoON'} //UC
        OUMappingObject['v96Y3OwzAuM'] = {'id': 'v96Y3OwzAuM', 'child': '' , 'parent': 'XX95LrNrYxR'} //Facility
        
    }

    //pakistan bMDp6ZvSiy4 - transfer in mapping
    if(props && props['bMDp6ZvSiy4'] == "ZyweqRVeQFD") {
        OUMappingObject['bMDp6ZvSiy4'] = {'id': 'bMDp6ZvSiy4', 'child': 'YiOSbdp8Kwp' , 'parent': '','type': 'region', 'level': 2} //country
        OUMappingObject['YiOSbdp8Kwp'] = {'id': 'YiOSbdp8Kwp', 'child': 'Q0YFqTAP52V' , 'parent': 'bMDp6ZvSiy4'} //province
        OUMappingObject['Q0YFqTAP52V'] = {'id': 'Q0YFqTAP52V', 'child': 'o5paO1ze0OH' , 'parent': 'YiOSbdp8Kwp'} //District
        OUMappingObject['o5paO1ze0OH'] = {'id': 'o5paO1ze0OH', 'child': 'WPzkMzRTyqp' , 'parent': 'Q0YFqTAP52V'} //Tehsil
        OUMappingObject['WPzkMzRTyqp'] = {'id': 'WPzkMzRTyqp', 'child': 'cGxGegt4j6Y' , 'parent': 'o5paO1ze0OH'} //UC
        OUMappingObject['cGxGegt4j6Y'] = {'id': 'cGxGegt4j6Y', 'child': '' , 'parent': 'WPzkMzRTyqp'} //Facility
        
    }

    //iran l9eB9W7EOPo
    if(props && props['SiBsB9zxBSP'] == "l9eB9W7EOPo") {
        OUMappingObject['SiBsB9zxBSP'] = {'id': 'SiBsB9zxBSP', 'child': 'B2ll6Kk3anQ' , 'parent': '','type': 'region', 'level': 2} //couuntry
        OUMappingObject['B2ll6Kk3anQ'] = {'id': 'B2ll6Kk3anQ', 'child': 'qcJdhdkFAVV' , 'parent': 'SiBsB9zxBSP'} //Province
        OUMappingObject['qcJdhdkFAVV'] = {'id': 'qcJdhdkFAVV', 'child': 'sdH4FMfRlXA' , 'parent': 'B2ll6Kk3anQ'} //University
        OUMappingObject['sdH4FMfRlXA'] = {'id': 'sdH4FMfRlXA', 'child': 'Kdk1Sfm48Rc' , 'parent': 'qcJdhdkFAVV'} // District
        OUMappingObject['Kdk1Sfm48Rc'] = {'id': 'Kdk1Sfm48Rc', 'child': '' , 'parent': 'sdH4FMfRlXA'} //Facility
        
    }
    //iran testing referral
    if(props && props['mj9S9NP1YNO'] == "l9eB9W7EOPo") {
        OUMappingObject['mj9S9NP1YNO'] = {'id': 'mj9S9NP1YNO', 'child': 'UnclrtBql0m' , 'parent': '','type': 'region', 'level': 2} //couuntry
        OUMappingObject['UnclrtBql0m'] = {'id': 'UnclrtBql0m', 'child': 'DQYx0l1KflS' , 'parent': 'mj9S9NP1YNO'} //Province
        OUMappingObject['DQYx0l1KflS'] = {'id': 'DQYx0l1KflS', 'child': 'ZpJfie0visa' , 'parent': 'UnclrtBql0m'} //University
        OUMappingObject['ZpJfie0visa'] = {'id': 'ZpJfie0visa', 'child': 'WlF4ogImXAx' , 'parent': 'DQYx0l1KflS'} // District
        OUMappingObject['WlF4ogImXAx'] = {'id': 'WlF4ogImXAx', 'child': '' , 'parent': 'ZpJfie0visa'} //Facility
        
    }
    //iran sample
    if(props && props['KWGsCG6974A'] == "l9eB9W7EOPo") {
        OUMappingObject['KWGsCG6974A'] = {'id': 'KWGsCG6974A', 'child': 'GHZ7ERbr3Cz' , 'parent': '','type': 'region', 'level': 2} //couuntry
        OUMappingObject['GHZ7ERbr3Cz'] = {'id': 'GHZ7ERbr3Cz', 'child': 'VgfSEGzQsew' , 'parent': 'KWGsCG6974A'} //Province
        OUMappingObject['VgfSEGzQsew'] = {'id': 'VgfSEGzQsew', 'child': 'g23MMzoV9ha' , 'parent': 'GHZ7ERbr3Cz'} //University
        OUMappingObject['g23MMzoV9ha'] = {'id': 'g23MMzoV9ha', 'child': 'cRuxx0UEunD' , 'parent': 'VgfSEGzQsew'} // District
        OUMappingObject['cRuxx0UEunD'] = {'id': 'cRuxx0UEunD', 'child': '' , 'parent': 'g23MMzoV9ha'} //Facility
        
    }

    //iran YLeE8d0YZkf - transfer out mapping
    if(props && props['YLeE8d0YZkf'] == "l9eB9W7EOPo") {
        OUMappingObject['YLeE8d0YZkf'] = {'id': 'YLeE8d0YZkf', 'child': 'iKLvfRnf4WH' , 'parent': '','type': 'region', 'level': 2} //country
        OUMappingObject['iKLvfRnf4WH'] = {'id': 'iKLvfRnf4WH', 'child': 'tHJSozsKehb' , 'parent': 'YLeE8d0YZkf'} //province
        OUMappingObject['tHJSozsKehb'] = {'id': 'tHJSozsKehb', 'child': 'qtSo6YjkUj6' , 'parent': 'iKLvfRnf4WH'} //University
        OUMappingObject['qtSo6YjkUj6'] = {'id': 'qtSo6YjkUj6', 'child': 'v96Y3OwzAuM' , 'parent': 'tHJSozsKehb'} //District
        OUMappingObject['v96Y3OwzAuM'] = {'id': 'v96Y3OwzAuM', 'child': '' , 'parent': 'qtSo6YjkUj6'} //Facility
    }

    //iran bMDp6ZvSiy4 - transfer in mapping
    if(props && props['bMDp6ZvSiy4'] == "l9eB9W7EOPo") {
        OUMappingObject['bMDp6ZvSiy4'] = {'id': 'bMDp6ZvSiy4', 'child': 'YiOSbdp8Kwp' , 'parent': '','type': 'region', 'level': 2} //country
        OUMappingObject['YiOSbdp8Kwp'] = {'id': 'YiOSbdp8Kwp', 'child': 'dFD4NhXSADR' , 'parent': 'bMDp6ZvSiy4'} //province
        OUMappingObject['dFD4NhXSADR'] = {'id': 'dFD4NhXSADR', 'child': 'Q0YFqTAP52V' , 'parent': 'YiOSbdp8Kwp'} //University
        OUMappingObject['Q0YFqTAP52V'] = {'id': 'Q0YFqTAP52V', 'child': 'cGxGegt4j6Y' , 'parent': 'dFD4NhXSADR'} //District
        OUMappingObject['cGxGegt4j6Y'] = {'id': 'cGxGegt4j6Y', 'child': '' , 'parent': 'Q0YFqTAP52V'} //Facility
    }

    
    //Afghanistan I9jfaLculAp
    if(props && props['SiBsB9zxBSP'] == "I9jfaLculAp") {
        OUMappingObject['SiBsB9zxBSP'] = {'id': 'SiBsB9zxBSP', 'child': 'B2ll6Kk3anQ' , 'parent': '','type': 'region', 'level': 2} // country
        OUMappingObject['B2ll6Kk3anQ'] = {'id': 'B2ll6Kk3anQ', 'child': 'sdH4FMfRlXA' , 'parent': 'SiBsB9zxBSP'} //province
        OUMappingObject['sdH4FMfRlXA'] = {'id': 'sdH4FMfRlXA', 'child': 'Kdk1Sfm48Rc' , 'parent': 'B2ll6Kk3anQ'} //district
        OUMappingObject['Kdk1Sfm48Rc'] = {'id': 'Kdk1Sfm48Rc', 'child': '' , 'parent': 'sdH4FMfRlXA'} //facility
       
        
    }
    //afghanistan testing referaal
    if(props && props['mj9S9NP1YNO'] == "I9jfaLculAp") {
        OUMappingObject['mj9S9NP1YNO'] = {'id': 'mj9S9NP1YNO', 'child': 'UnclrtBql0m' , 'parent': '','type': 'region', 'level': 2} // country
        OUMappingObject['UnclrtBql0m'] = {'id': 'UnclrtBql0m', 'child': 'ZpJfie0visa' , 'parent': 'mj9S9NP1YNO'} //province
        OUMappingObject['ZpJfie0visa'] = {'id': 'ZpJfie0visa', 'child': 'WlF4ogImXAx' , 'parent': 'UnclrtBql0m'} //district
        OUMappingObject['WlF4ogImXAx'] = {'id': 'WlF4ogImXAx', 'child': '' , 'parent': 'ZpJfie0visa'} //facility
    }
    //afghanistan sample
    if(props && props['KWGsCG6974A'] == "I9jfaLculAp") {
        OUMappingObject['KWGsCG6974A'] = {'id': 'KWGsCG6974A', 'child': 'GHZ7ERbr3Cz' , 'parent': '','type': 'region', 'level': 2} // country
        OUMappingObject['GHZ7ERbr3Cz'] = {'id': 'GHZ7ERbr3Cz', 'child': 'g23MMzoV9ha' , 'parent': 'KWGsCG6974A'} //province
        OUMappingObject['g23MMzoV9ha'] = {'id': 'g23MMzoV9ha', 'child': 'cRuxx0UEunD' , 'parent': 'GHZ7ERbr3Cz'} //district
        OUMappingObject['cRuxx0UEunD'] = {'id': 'cRuxx0UEunD', 'child': '' , 'parent': 'g23MMzoV9ha'} //facility
    }

    //Afghanistan YLeE8d0YZkf - transfer out
    if(props && props['YLeE8d0YZkf'] == "I9jfaLculAp") {
        OUMappingObject['YLeE8d0YZkf'] = {'id': 'YLeE8d0YZkf', 'child': 'iKLvfRnf4WH' , 'parent': '','type': 'region', 'level': 2} // country
        OUMappingObject['iKLvfRnf4WH'] = {'id': 'iKLvfRnf4WH', 'child': 'qtSo6YjkUj6' , 'parent': 'YLeE8d0YZkf'} //province
        OUMappingObject['qtSo6YjkUj6'] = {'id': 'qtSo6YjkUj6', 'child': 'v96Y3OwzAuM' , 'parent': 'iKLvfRnf4WH'} //district
        OUMappingObject['v96Y3OwzAuM'] = {'id': 'v96Y3OwzAuM', 'child': '' , 'parent': 'qtSo6YjkUj6'} //facility
    }

    //Afghanistan bMDp6ZvSiy4 - transfer in mapping
    if(props && props['bMDp6ZvSiy4'] == "I9jfaLculAp") {
        OUMappingObject['bMDp6ZvSiy4'] = {'id': 'bMDp6ZvSiy4', 'child': 'YiOSbdp8Kwp' , 'parent': '','type': 'region', 'level': 2} // country
        OUMappingObject['YiOSbdp8Kwp'] = {'id': 'YiOSbdp8Kwp', 'child': 'Q0YFqTAP52V' , 'parent': 'bMDp6ZvSiy4'} //province
        OUMappingObject['Q0YFqTAP52V'] = {'id': 'Q0YFqTAP52V', 'child': 'cGxGegt4j6Y' , 'parent': 'YiOSbdp8Kwp'} //district
        OUMappingObject['cGxGegt4j6Y'] = {'id': 'cGxGegt4j6Y', 'child': '' , 'parent': 'Q0YFqTAP52V'} //facility
    }*/
    
    return (
        
        OUMappingObject
        )
}
