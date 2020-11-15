import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'
  
 class FooterComponent extends Component {
    render() {
      return (
        <footer className="footer ">
          <div className="container ">
              <div className="row">             
                  <div className="col-4 offset-1 col-sm-2"> 
                      <h5>Links</h5>
                  </div>
                  <div className="col-7 col-sm-5">
                      <h5>Our Address</h5>
                      
                        SICE, Bloomington<br/>
                        Indiana, USA<br/>
                        <span className="fa fa-phone fa-lg"></span>: +000 000 0000<br/>
                        <span className="fa fa-fax fa-lg"></span>: +000 000 0000<br/>
                        
                  </div>
            </div>
            <div className="row justify-content-center">             
                  <div className="col-auto">
                      <p>© Copyright 2020 Quick-Pick</p>
                  </div>
            </div>
          </div>
        </footer>
      );
    }
  }

export default FooterComponent