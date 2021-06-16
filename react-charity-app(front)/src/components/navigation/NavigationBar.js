import React, { Component } from "react"
import "./NavigationBar.css"

export default class NavigationBar extends Component {
  //header component
  render() {
    return (
      <div className="nav-background">
        <div className="main-nav">
          <div className="squeeze">
            <div>
              <div className="nav-flex">
                <ul>
                  <li className="nav-title">서가</li>
                </ul>
                <div className="nav-align-right">
                  <div className="nav-flex-right">
                    <a href="https://github.com/kysung95">
                      <div className="ion-social-github"></div>
                    </a>
                    <a href="https://www.instagram.com/seoga0217/?hl=en">
                      <div className="ion-social-instagram-outline"></div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
