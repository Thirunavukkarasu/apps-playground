package models

import "time"

type Todo struct {
	ID        int64     `json:"id" gorm:"primaryKey"`
	UserID    int64     `json:"userId" gorm:"not null;index"`
	User      User      `json:"-" gorm:"constraint:OnDelete:CASCADE;foreignKey:UserID;references:ID"`
	Title     string    `json:"title" gorm:"not null"`
	Completed bool      `json:"completed" gorm:"not null;default:false"`
	CreatedAt time.Time `json:"createdAt" gorm:"not null"`
}

