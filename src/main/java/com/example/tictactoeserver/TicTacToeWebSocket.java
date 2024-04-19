package com.example.tictactoeserver;

import jakarta.websocket.*;
import jakarta.websocket.server.ServerEndpoint;
import org.json.JSONObject;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.json.JSONArray;
@ServerEndpoint("/game")
public class TicTacToeWebSocket {
    private static final String[][] board = new String[3][3];
    private static volatile String currentPlayer = "X"; // Start with X
    private static final Map<Session, String> playerSessions = new ConcurrentHashMap<>();

    static {
        clearBoard();
    }

    @OnOpen
    public void onOpen(Session session) throws IOException {
        if (playerSessions.size() < 2) {
            String symbol = playerSessions.isEmpty() ? "X" : "O";
            playerSessions.put(session, symbol);
            JSONObject response = new JSONObject();
            response.put("type", "turn");
            response.put("symbol", symbol);
            session.getBasicRemote().sendText(response.toString());
            if (playerSessions.size() == 2) {
                broadcastBoard();
            }
        } else {
            session.getBasicRemote().sendText("{\"message\":\"Game is already in progress. Please wait.\"}");
        }
    }

    @OnMessage
    public void onMessage(String message, Session session) throws IOException {
        JSONObject json = new JSONObject(message);
        if ("move".equals(json.getString("action"))) {
            String symbol = json.getString("symbol");
            int id = json.getInt("id");
            int row = id / 3;
            int col = id % 3;
            if (board[row][col] == null || board[row][col].isEmpty()) { // Check if the cell is empty
                board[row][col] = symbol;
                currentPlayer = currentPlayer.equals("X") ? "O" : "X"; // Switch turns
                broadcastBoard();
            }
        }
    }

    @OnClose
    public void onClose(Session session) {
        playerSessions.remove(session);
        if (playerSessions.size() < 2) {
            broadcast("{\"message\":\"A player has disconnected. Waiting for a new player.\"}");
            clearBoard();
        }
    }

    @OnError
    public void onError(Session session, Throwable throwable) {
        throwable.printStackTrace();
    }

    private void broadcastBoard() throws IOException {
        JSONArray jsonBoard = new JSONArray(board);
        JSONObject message = new JSONObject();
        message.put("type", "update");
        message.put("board", jsonBoard);
        message.put("nextTurn", currentPlayer);
        broadcast(message.toString());
    }

    private void broadcast(String message) {
        playerSessions.keySet().forEach(session -> {
            try {
                session.getBasicRemote().sendText(message);
            } catch (IOException e) {
                e.printStackTrace();
            }
        });
    }

    private static void clearBoard() {
        for (int i = 0; i < 3; i++) {
            for (int j = 0; j < 3; j++) {
                board[i][j] = "";
            }
        }
    }
}
